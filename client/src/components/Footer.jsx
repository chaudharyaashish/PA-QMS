import React from 'react';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light">
            <div className="container text-center">
                <span className="text-muted">© {new Date().getFullYear()} Doctor Appointment System. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;