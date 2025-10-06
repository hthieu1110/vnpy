--- /Users/yo1110/Projects/yo/vnpy/.venv/lib/python3.12/site-packages/centrifuge/client.py	2025-10-06 12:18:13
+++ /Users/yo1110/Projects/yo/vnpy/.venv/lib/python3.12/site-packages/centrifuge/client_patch.py	2025-10-06 12:18:03
@@ -302,10 +302,17 @@
         if self._use_protobuf:
             subprotocols = ["centrifuge-protobuf"]
         try:
+            import ssl
+            ssl_context = ssl.create_default_context()
+            # Option 1: disable verification (unsafe, testing only)
+            ssl_context.check_hostname = False
+            ssl_context.verify_mode = ssl.CERT_NONE
+
             self._conn = await websockets.connect(
                 self._address,
                 subprotocols=subprotocols,
                 additional_headers=self._headers,
+                ssl=ssl_context
             )
         except (OSError, exceptions.WebSocketException) as e:
             handler = self.events.on_error
