from vnpy.rpc import RpcClient  
from vnpy.trader.object import SubscribeRequest  

from api.config import RPC_HOST, RPC_REP_PORT, RPC_PUB_PORT
  
def main():  
    """Start RPC Client"""  
    # Create RPC client  
    rpc_client = RpcClient()  
      
    # Connect to RPC server  
    # rep_address: for request-reply (function calls)  
    # sub_address: for publish-subscribe (data push)
    print("Connecting to RPC server...")
    rpc_client.start(  
        req_address=f"tcp://{RPC_HOST}:{RPC_REP_PORT}",  
        sub_address=f"tcp://{RPC_HOST}:{RPC_PUB_PORT}"  
    )  
    
    print("Getting all contracts...")
    accounts = rpc_client.get_all_contracts()  
    print(f"Accounts: {accounts}")  

    input("Press Enter to exit...")  
    rpc_client.stop()  
  
if __name__ == "__main__":  
    main()