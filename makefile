PHONY: test
test:	
	python vnpy_hsc/gateway/test.py

PHONY: hsc
hsc:
	python cmd/hsc.py

PHONY: hsc_dev
hsc_dev:
	python cmd/hsc_dev.py

PHONY: paper
paper:
	python cmd/paper.py

PHONY: binance
binance:
	python cmd/binance.py

PHONY: ib
ib:
	python cmd/ib.py

PHONY: patch_centrifuge
patch_centrifuge:
	cp .venv/lib/python3.12/site-packages/centrifuge/client.py .venv/lib/python3.12/site-packages/centrifuge/client_bk.py
	cp vnpy_hsc/gateway/patch/client_patch.py .venv/lib/python3.12/site-packages/centrifuge/client.py

PHONY: rpc_server
rpc_server:
	./auto_reload.py api/rpc_server.py

PHONY: api_server
api_server:
	python api/api_server.py

PHONY: centri
centri:
	cd api && ./centrifugo --config=centrifugo.json

PHONY: gen_proto
gen_proto:
	python -m grpc_tools.protoc -Iproto --python_out=api --grpc_python_out=api proto/*.proto