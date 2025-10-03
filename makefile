PHONY: test
test:	
	python vnpy/gateway/hsc/test.py

PHONY: hsc
hsc:
	python cmd/hsc.py

PHONY: hsc_dev
hsc_dev:
	python cmd/hsc_dev.py

PHONY: local
local:
	python cmd/local.py

PHONY: binance
binance:
	python cmd/binance.py