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