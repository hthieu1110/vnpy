PHONY: test
test:	
	python vnpy/gateway/hsc/test.py

PHONY: hsc
hsc:
	python cmd/hsc.py

PHONY: local
local:
	python cmd/local.py

PHONY: binance
binance:
	python cmd/binance.py