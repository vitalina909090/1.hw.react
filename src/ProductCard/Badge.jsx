import React from 'react';

const Badge = ({ badges }) => {
    if (badges.length <= 0) return null;
    return (
        <div className='badges'>
            {badges.map((badge) => (
                <span key={badge} className={`badge-${badge}`}>
                    {badge.toUpperCase()}
                </span>
            ))}
        </div>
    );
}

export default Badge;
