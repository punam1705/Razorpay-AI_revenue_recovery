from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.customer import Customer
from schemas.customer import (
    CustomerCreate,
    CustomerResponse,
)


router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"],
)


@router.get(
    "",
    response_model=list[CustomerResponse],
)
def get_customers(
    db: Session = Depends(get_db),
):
    return (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=201,
)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
):

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id
            == customer_data.customer_id
        )
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=409,
            detail="Customer already exists",
        )

    customer = Customer(
        customer_id=customer_data.customer_id,
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
        previous_orders=customer_data.previous_orders,
        successful_payments=customer_data.successful_payments,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: str,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == customer_id
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer