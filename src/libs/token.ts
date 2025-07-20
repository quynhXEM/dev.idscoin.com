import { ethers } from "ethers";

// Hàm chuyển coin (ETH, BNB, MATIC, ...)
export async function sendCoin({
  amount,
  rpc,
  privateKey,
  to,
  chain_id,
}: {
  amount: string | number;
  rpc: string;
  privateKey: string;
  to: string;
  chain_id: number;
}) {
  const provider = new ethers.JsonRpcProvider(rpc, chain_id);
  const wallet = new ethers.Wallet(privateKey, provider);
  const txPromise = wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount.toString()),
    chainId: chain_id,
  });
  return await waitForTransactionSuccess(txPromise, provider);
}

// Hàm chuyển token ERC20
export async function sendToken({
  amount,
  rpc,
  token_address,
  privateKey,
  to,
  chain_id,
}: {
  amount: string | number;
  rpc: string;
  token_address: string;
  privateKey: string;
  to: string;
  chain_id: number;
}) {
  const provider = new ethers.JsonRpcProvider(rpc, chain_id);
  const wallet = new ethers.Wallet(privateKey, provider);
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() view returns (uint8)",
  ];
  const token = new ethers.Contract(token_address, erc20Abi, wallet);
  const decimals = await token.decimals();
  const amountParsed = ethers.parseUnits(amount.toString(), decimals);
  const txPromise = token.transfer(to, amountParsed);
  return await waitForTransactionSuccess(txPromise, provider);
}

// Hàm chờ xác nhận giao dịch thành công
export async function waitForTransactionSuccess(txPromise: Promise<any>, provider?: any) {
  try {
    const tx = await txPromise;
    // Nếu đã có provider thì dùng provider đó, nếu không thì lấy từ tx
    const usedProvider = provider || tx?.provider;
    if (!usedProvider) throw new Error("Không tìm thấy provider để xác nhận giao dịch");
    const receipt = await usedProvider.waitForTransaction(tx.hash, 1, 30000); // timeout 60s
    if (receipt && receipt.status === 1) {
      return receipt.hash;
    } else {
      throw new Error("Giao dịch thất bại hoặc bị từ chối trên blockchain");
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error("Giao dịch không thành công: " + errorMsg);
  }
}

export const getBalance = async (
  metadata: any,
  address: string,
  chainId?: number,
  tokenAddress?: string
): Promise<string> => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("Không tìm thấy provider");
  }
  try {
    const { custom_fields: {usdt_payment_wallets_testnet, ids_distribution_wallet}} = metadata;
    const provider = (window as any).ethereum;

    // Chuyển chain nếu cần
    if (chainId) {
      const currentChain = await provider.request({ method: "eth_chainId" });
      if (parseInt(currentChain, 16) !== chainId) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId:
                usdt_payment_wallets_testnet[
                  chainId as keyof typeof usdt_payment_wallets_testnet
                ]?.chainId || "0x" + chainId.toString(16),
            },
          ],
        });
      }
    }

    if (!tokenAddress) {
      // Lấy số dư coin
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      if (!balanceHex || balanceHex === "0x") {
        return "0.00";
      }
      return (Number(BigInt(balanceHex)) / 1e18).toFixed(2).toString();
    } else {
      // Lấy số dư token ERC20
      const methodId = "0x70a08231"; // balanceOf(address)
      const addressPadded = address.replace("0x", "").padStart(64, "0");
      const data = methodId + addressPadded;

      const balanceHex = await provider.request({
        method: "eth_call",
        params: [
          {
            to: tokenAddress,
            data,
          },
          "latest",
        ],
      });
      if (!balanceHex || balanceHex === "0x") {
        // (fix) xóa điều kiện này giữ lại để lấy số dư coin
        return "0.00";
      }
      // Lấy số thập phân của token
      const decimalsData = "0x313ce567"; // decimals()
      const decimalsHex = await provider.request({
        method: "eth_call",
        params: [
          {
            to: tokenAddress,
            data: decimalsData,
          },
          "latest",
        ],
      });
      const decimals = parseInt(decimalsHex, 16);
      return (Number(BigInt(balanceHex)) / 10 ** decimals)
        .toFixed(2)
        .toString();
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
    return "0";
  }
};
