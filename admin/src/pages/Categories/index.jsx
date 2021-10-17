import { Button } from '@material-ui/core';
import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../utils/context/LayoutContext";
import DataTable from 'react-data-table-component';
import AddDialog from './components/add-dialog';
import DeleteDialog from './components/delete-dialog';
import { getCategories, getCategoryPhoto } from '../../utils/services/request';

const Columns = (handleDelete, handleEdit) => [
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
        name: 'Photo',
        selector: 'photo',
        sortable: false,
        format: row => <img src={getCategoryPhoto(row.photo)} alt="" className="category-photo" />
    },
    {
        name: 'Actions',
        selector: 'id',
        format: (row) => (
            <div className="table-actions-column">
                <Button color="primary" variant="contained" onClick={() => handleEdit(row)}>Edit</Button>
                <Button color="secondary" variant="contained" onClick={() => handleDelete(row)}>Delete</Button>
            </div>)
    }
]

const CategoriesPage = props => {

    const [data, setData] = useState([]);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [progressPadding, setProgressPadding] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const layoutCtx = useContext(LayoutContext);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        
        try{
            layoutCtx.showPreLoader();
            let res = await getCategories();
            
            if(res.status){
                layoutCtx.hidePreLoader();
                setData(res.data);
                return;
            }
            layoutCtx.hidePreLoader();
            layoutCtx.showSnack(res.message, 'error');
        }catch(err){
            layoutCtx.hidePreLoader();
            layoutCtx.showSnack(err.message || 'unknown error', 'error')
        }
    }

    const handleCreateDialogOpen = () => setCreateDialogOpen(true);

    const handleCreateDialogClose = (status) => {
        if(status){
            setCreateDialogOpen(false);
            loadData();
            return;
        }

        setCreateDialogOpen(false);
    }

    const handleEdit = row => {
        setSelectedRow(row);
        setDeleteDialogOpen(true);
    }

    const handleDelete = row => {
        setSelectedRow(row);
        setDeleteDialogOpen(true);
    }

    const handleDeleteDialogClose = (status) => {
        if(status){
            setDeleteDialogOpen(false);
            setSelectedRow(false);
            loadData();
            return;
        }

        setDeleteDialogOpen(false);
        setSelectedRow(null);
    }

    return (
        <main className="categories-page">
            <header>
                <h1>Categories</h1>
                <Button variant="contained" color="primary" onClick={handleCreateDialogOpen}>Create</Button>
            </header>
            <section>
                <DataTable 
                    title={false}
                    columns={Columns(handleDelete, handleEdit)} 
                    data={data} 
                    pagination
                    noHeader
                    className='data-table'
                    progressPadding={progressPadding} />
            </section>
            <footer></footer>

            <AddDialog handleClose={handleCreateDialogClose} open={createDialogOpen} />
            <DeleteDialog open={deleteDialogOpen} handleClose={handleDeleteDialogClose} data={selectedRow} />
        </main>
    );
}

export default CategoriesPage;