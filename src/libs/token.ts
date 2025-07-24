import { ethers } from "ethers";
import { roundDownDecimal } from "./utils";

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
    const receipt = await usedProvider.waitForTransaction(tx.hash, 1, 60000); // timeout 60s
    if (receipt && receipt.status === 1) {
      return receipt.hash;
    } else {
      throw new Error("Transaction failed or rejected on blockchain");
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error("Transaction failed: " + errorMsg);
  }
}

export const getBalance = async (
  address: string,
  chainId?: number,
  tokenAddress?: string,
  rpc?: string
): Promise<string> => {
  try {
    // Ưu tiên lấy rpc từ tham số, nếu không có thì lấy từ metadata
    const rpcUrl = rpc;
    if (!rpcUrl) throw new Error("Thiếu RPC endpoint");
    const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);

    if (!tokenAddress) {
      // Lấy số dư coin
      const balanceBigInt = await provider.getBalance(address);
      return roundDownDecimal(Number(balanceBigInt) / 1e18).toString();
    } else {
      // Lấy số dư token ERC20
      const erc20Abi = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
      ];
      const token = new ethers.Contract(tokenAddress, erc20Abi, provider);
      const [balance, decimals] = await Promise.all([
        token.balanceOf(address),
        token.decimals(),
      ]);
      return roundDownDecimal(Number(balance) / Math.pow(10, Number(decimals))).toString();
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
    }
    return "0";
  }
};
