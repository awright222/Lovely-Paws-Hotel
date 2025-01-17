from .db import db, environment, SCHEMA

class Booking(db.Model):
  __tablename__ = 'bookings'

  if environment == 'production':
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  client_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.users.id' if environment == "production" else 'users.id'), nullable=False)
  pet_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.pets.id' if environment == "production" else 'pets.id'), nullable=False)
  booking_type = db.Column(db.String(50), nullable=False)
  drop_off_date = db.Column(db.DateTime, nullable=False)
  pick_up_date = db.Column(db.DateTime, nullable=False)
  daily_price = db.Column(db.Numeric(precision=6, scale=2), nullable=True, default=99.99)
  daily_pic = db.Column(db.String, nullable=True)

  services = db.relationship(
    'Service',
    secondary='booking_service',
    back_populates='booking',
    lazy='dynamic'
  )

  def to_dict(self):
    return {
      'id': self.id,
      'client_id': self.client_id,
      'pet_id': self.pet_id,
      'booking_type': self.booking_type,
      'drop_off_date': self.drop_off_date,
      'pick_up_date': self.pick_up_date,
      'daily_price': self.daily_price,
      'daily_pic': self.daily_pic,
      'services': [{
        'id': service.id,
        'service': service.service,
        'price': service.price
      } for service in self.services]
    }