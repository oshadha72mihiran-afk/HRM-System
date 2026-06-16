from fastapi import Header, HTTPException, status


def get_current_user(authorization: str | None = Header(default=None)) -> dict[str, str]:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    return {"sub": "demo-user"}
