"""add recipient user foreign key

Revision ID: 5adf08db876f
Revises: 45c03ef1d653
Create Date: 2026-09-09 14:20:44.738897

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5adf08db876f'
down_revision: Union[str, None] = '45c03ef1d653'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.create_foreign_key(
        None,
        "recipients",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )



def downgrade() -> None:
    op.drop_constraint(
        None,
        "recipients",
        type_="foreignkey",
    )
