PHONY: test
test:	
	python vnpy/gateway/hsc/test.py

PHONY: hsc
hsc:
	python hsc.py