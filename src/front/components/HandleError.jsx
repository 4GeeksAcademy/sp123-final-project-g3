import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function HandleError(key) {
    const nav = useNavigate()
    return (
        <>
            <div className="modal fade container m-2" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">MeetFit</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Parece que algo ha salido mal!
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={()=>{return nav('/login')}}>Ir a Home (cambiar, esto te lleva a login actualmente)</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
