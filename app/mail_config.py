from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="kaushikdontu1711@gmail.com",
    MAIL_PASSWORD="vsbg yicl vxve sxal",
    MAIL_FROM="kaushikdontu1711@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

