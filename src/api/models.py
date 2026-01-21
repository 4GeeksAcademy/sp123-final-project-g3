from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()


class Users(db.Model):
    

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    profesional_title = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {"id": self.id, 
                "email": self.email,
                "name": self.name,
                "porfessional_title": self.profesional_title,
                "created_at": self.created_at
                }


class CV(db.Model):
    
    
    id = db.Column(db.Integer, primary_key=True)
    cv_url = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_to = db.relationship("Users", 
                            foreign_keys = [user_id], 
                            backref= db.backref("user_cvs", lazy="select"))
    
    
    def __repr__(self):
        return f'<CV {self.id}>'
    
    def serialize(self):
        return {"id": self.id, 
                "cv-url": self.cv_url,
                "created_at": self.created_at
                }
        
        
class Job(db.Model):
    
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(120), nullable=False)
    link = db.Column(db.String(300))
    about_job = db.Column(db.Text)
    accountabilities = db.Column(db.Text)
    requirements = db.Column(db.Text)
    benefits = db.Column(db.Text)
    salary = db.Column(db.String(120))
    location = db.Column(db.String(120))
    notes = db.Column(db.Text)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    
    def __repr__(self):
        return f'<Job {self.title}>'
    
    def serialize(self):
        return {"id": self.id, 
                "title": self.title,
                "company": self.company,
                "salary": self.salary,
                "location": self.location,
                "created_at": self.created_at
                }
        
        
class Postulations(db.Model):
    
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"), nullable=False)
    cv_id = db.Column(db.Integer, db.ForeignKey("cv.id"), nullable=False)
    interview_date = db.Column(db.DateTime)
    user_to = db.relationship("Users",
                              foreign_keys=[user_id],
                              backref = db.backref("user_postulation", lazy="select"))
    cv_to = db.relationship("CV",
                              foreign_keys=[cv_id],
                              backref = db.backref("cv_postulation", lazy="select"))
    job_to = db.relationship("Job",
                              foreign_keys=[job_id],
                              backref = db.backref("job_postulation", lazy="select"))
    
    
    def __repr__(self):
        return f'<Postulation {self.name}>'
    
    def serialize(self):
        return {"id": self.id, 
                "name": self.name,
                "status": self.status,
                "user_id": self.user_id,
                "job_id": self.job_id,
                "cv_id": self.cv_id,
                "interview_date": self.interview_date
                }
        
        
