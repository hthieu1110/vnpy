# Virtual environment configuration
VENV = .venv
PYTHON = $(VENV)/bin/python

PHONY: test
test:
	$(PYTHON) vnpy_hsc/gateway/test.py

PHONY: hsc
hsc:
	$(PYTHON) cmd/hsc.py

PHONY: hsc_dev
hsc_dev:
	$(PYTHON) cmd/hsc_dev.py

PHONY: paper
paper:
	$(PYTHON) cmd/paper.py

PHONY: vision
vision:
	$(PYTHON) cmd/vision.py

PHONY: ib
ib:
	$(PYTHON) cmd/ib.py

PHONY: patch_centrifuge
patch_centrifuge:
	cp .venv/lib/python3.12/site-packages/centrifuge/client.py .venv/lib/python3.12/site-packages/centrifuge/client_bk.py
	cp vnpy_hsc/gateway/patch/client_patch.py .venv/lib/python3.12/site-packages/centrifuge/client.py

PHONY: rpc_server
rpc_server:
	$(PYTHON) auto_reload.py api/rpc_server.py

PHONY: api_server
api_server:
	$(PYTHON) api/api_server.py

PHONY: centri
centri:
	cd api && centrifugo --config=centrifugo.json

PHONY: gen_proto
gen_proto:
	$(PYTHON) -m grpc_tools.protoc -Iproto --python_out=api --grpc_python_out=api proto/*.proto

PHONY: install_centri
install_centri:
	curl -s https://centrifugal.dev/install.sh | bash

PHONY: webapp
webapp:
	cd web && npm run dev
