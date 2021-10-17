import { Button } from '@material-ui/core';
import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../utils/context/LayoutContext";
import DataTable from 'react-data-table-component';

const Columns = [
    {
        name: '#',
        selector: 'id',
        sortable: true,
    },
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Actions',
        selector: 'id',
        format: (row) => <div className="table-actions-column"><Button color="primary" variant="contained">Edit</Button><Button color="secondary" variant="contained">Delete</Button></div>
    }
]

const CategoriesPage = props => {

    const [data, setData] = useState([
        {id: 1, name: 'Music'},
        {id: 2, name: 'Weekly Covers'},
        {id: 3, name: 'Monthly Covers'}
    ]);

    const [progressPadding, setProgressPadding] = useState(false);

    const layoutCtx = useContext(LayoutContext);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

    }

    return (
        <main className="categories-page">
            <header>
                <h1>Categories</h1>
                <Button variant="contained" color="primary">Create</Button>
            </header>
            <section>
                <DataTable 
                    title={false}
                    columns={Columns} 
                    data={data} 
                    pagination
                    noHeader
                    className='data-table'
                    progressPadding={progressPadding} />
            </section>
            <footer></footer>
        </main>
    );
}

export default CategoriesPage;