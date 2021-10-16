import {useState} from 'react'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
const DatePickerDialog = (props) => {

    const [ranges, setRanges] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ]);

    const handleDateChange = (item) => {
        setRanges([item.selection])
    }

    const handleConfirm = () => {
        props.handleRangeChange(ranges);
        props.close()
    }

    return (
        <Dialog
        open={props.open}
        onClose={() => props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="l"
      >
        <DialogTitle id="alert-dialog-title">{"Select range"}</DialogTitle>
        <DialogContent>
        <DateRangePicker
            onChange={handleDateChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={ranges}
            direction="horizontal"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.close()} color="primary">
            Disagree
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    ) 
}

export default DatePickerDialog;