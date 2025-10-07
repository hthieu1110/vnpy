# Explain the architecture:

- api_server: FastAPI that serves requests
- rpc_server: 
    - bridge http call to FastAPI => vn.py rpc call: e.g: gateway connect...
    - register event from vn.py engine then publish to centrifugo server
- centrifugo server: bridge event from vn.py to web
- web: react application that request to api_server and get stream from centrifugo server

ATTENTION: 
- all api configs are in api/config.py
- all web configs are in .env

# Installation
1. Install dependencies:
    
    uv sync
2. Sometime the gateway has problem with TLS so we need to patch:

    make patch_centrifuge

# Run
1. Run rpc server

    make rpc_server

2. Run api server
    
    make api_server

3. Run centri server
   
   make centri

4. Run web
   
   make webapp