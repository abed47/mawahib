import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = () => {
      window.print()
  }

  return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="printable invoice">
                <div className="header">
                    <h1>Invoice</h1>
                    <p>25/11/2020</p>
                </div>
                <div className="items">
                    {
                        props.data && props.data.map(item => {
                            return (
                                <div className="item">
                                    <span className="id">ORD-{item.id}</span>
                                    <span className="total">{item.price ? item.price + "$" : "awaiting pricing"}</span>
                                    <span className="status">
                                        {item.status == 1 ? "Pending" : 
                                        item.status == 2 ? "Quoted" :
                                        item.status == 3 ? "Priced" :
                                         item.status == 4 ? "OTW" : 
                                         item.status == 5 ? "Delivered" : 
                                         "Canceled"}
                                    </span>
                                    <span className="date">{item.created_at}</span>
                                </div>
                            )
                        })
                    }
                    
                </div>
                <div className="signatures">
                    <div className="client">
                        <h4>Client's signature</h4>
                        <div></div>
                    </div>
                </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={props.close} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={handlePrint} color="primary" autoFocus>
            Print
          </Button>
        </DialogActions>
      </Dialog>
  );
}