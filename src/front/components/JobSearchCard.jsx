import React from "react";

const JobSearchCard = ({ job }) => {
    return (
        <div className="job-card">
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>
            <p className="job-location">{job.location}</p>
            <span className="job-type">{job.type}</span>
        </div>
    );
};

export default JobSearchCard;
