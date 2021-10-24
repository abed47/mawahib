import { useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Pagination } from '@mui/material';
import { getVideoThumbnailPublicPath, searchVideos } from '../../../utils/services/request';
import { AuthContext } from '../../../utils/context/auth';
import { LayoutContext } from '../../../utils/context/layout';

const MawahibTheme = createTheme({
    palette:{
        mode: 'dark',
        primary:{
            main: '#006796'
        }
    }
});


const UploadsTab = (props) => {
    
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const authCtx = useContext(AuthContext);
    const layoutCtx = useContext(LayoutContext);

    useEffect(() => {
        
        loadData();

        return () => {
            
        }
    }, [currentPage]);

    const loadData = async () => {
        setLoading(true);
        try{
            let body = {
                fields:{
                    channel_id: authCtx.channel.id,
                    user_id: authCtx.user.id
                },
                pagination:{
                    limit: 10,
                    offset: 10 * (currentPage - 1)
                }
            };

            if(query) body['fields']['title'] = query;
            if(query) body['fields']['description'] = query;
            if(query) body['exact'] = true;

            let res = await searchVideos(body);
            
            if(res.status){
                setVideos(res.data);
                setPageCount(Math.ceil(res.pagination.totalRows / 10))
                setLoading(false);
                return;
            }
        }catch(err){
            console.log('from error', err);
            setLoading(false);
        }
    }

    const handlePageChange = (e,v,i) => {
        setCurrentPage(v);
        // loadData();
    }

    const handleSearch = () => {
        loadData();
    }

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        
        console.log(e)
    }

    return (
        <ThemeProvider theme={MawahibTheme}>
            <div className="uploads-tab-content">
                <div className="top-bar">
                    <h1>Videos</h1>

                    <TextField 
                        variant="standard"
                        label="Search"
                        color="primary"
                        value={query}
                        onChange={handleQueryChange}
                        onKeyPress= {(e) => {
                            if (e.key === 'Enter') {
                              handleSearch()
                            }
                        }}
                    />
                </div>
                
                <div className="content">
                    <div className="listing">
                        <div className={`loading-container ${loading ?  'active' : ''}`}>
                            <CircularProgress />
                        </div>

                        {
                            videos.map((item, i) => {
                                return (
                                <div className="video-item" key={`video-${i}`}>
                                    <div className="photo">
                                        <img src={getVideoThumbnailPublicPath(item.thumbnail)} alt="thumbnail" />
                                    </div>
                                    <div className="info">
                                        <h1 className="title">{item.title}</h1>
                                        <p className="description">{item.description}</p>
                                    </div>
                                </div>);
                            })
                        }
                    </div>
                    <div className="pagination">
                        <Pagination 
                            count={pageCount} 
                            page={currentPage}
                            onChange={handlePageChange} 
                        />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default UploadsTab;