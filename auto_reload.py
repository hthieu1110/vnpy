#!/usr/bin/env python

import sys
from vnpy_hsc.utils.auto_reload import auto_reload


if __name__ == "__main__":
    args = sys.argv[1:]

    if len(args) != 1:
        print("Usage: python cmd/_auto_reload.py <name>")
        sys.exit(1)
        
    if ".py" in args[0]:
        name = args[0]
    else:
        name = f"cmd/{args[0]}.py"

    auto_reload(name)