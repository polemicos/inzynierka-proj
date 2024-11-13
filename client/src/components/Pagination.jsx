import React from 'react';

const Pagination = ({ limit, total, paginate }) => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(total / limit); i++) {
        pages.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                {pages.map(page => (
                    <li key={page} className="page-item">
                        <a onClick={() => paginate(page)} className="page-link ">{page}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination;
