"""Add first_name and last_name to user

Revision ID: 095badf57331
Revises: 669a11f0b9e0
Create Date: 2025-12-08 13:25:39.568704

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '095badf57331'
down_revision = '669a11f0b9e0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('first_name', sa.String(length=120), nullable=True))
        batch_op.add_column(
            sa.Column('last_name', sa.String(length=120), nullable=True))


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
