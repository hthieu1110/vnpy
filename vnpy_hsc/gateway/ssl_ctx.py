import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.options |= 0x4  # SSL_OP_LEGACY_SERVER_CONNECT (may be required)
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def get_ssl_ctx():
    return ssl_ctx