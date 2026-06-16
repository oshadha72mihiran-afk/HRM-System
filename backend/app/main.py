from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.departments import router as departments_router
from app.api.routes.employees import router as employees_router
from app.api.routes.payrolls import router as payrolls_router
from app.api.routes.positions import router as positions_router
from app.core.config import settings

app = FastAPI(title="HRM System API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.api_v1_prefix}/auth", tags=["Auth"])
app.include_router(departments_router, prefix=f"{settings.api_v1_prefix}/departments", tags=["Departments"])
app.include_router(positions_router, prefix=f"{settings.api_v1_prefix}/positions", tags=["Positions"])
app.include_router(employees_router, prefix=f"{settings.api_v1_prefix}/employees", tags=["Employees"])
app.include_router(payrolls_router, prefix=f"{settings.api_v1_prefix}/payrolls", tags=["Payrolls"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
