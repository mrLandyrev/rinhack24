import { useCallback, useState } from 'react';
import './App.css';
import { AppBar, Box, Button, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function App() {

  const [expression, setExpression] = useState("")
  const [items, setItems] = useState(new Array<{
    id: string,
    name: string,
    points: string[],
  }>())
  const [isLoading, setIsLoading] = useState(false)

  const search = useCallback((pattern: string) => {
    setIsLoading(true)
    setItems([])
    setExpression(pattern)
    const eventSource = new EventSource(`http://reverse-matrix.ru/api/report?regExps=${pattern}`);
    eventSource.onmessage = function (event) {
      if (event.data === "close") {
        eventSource.close()
        setIsLoading(false)
      } else {
        const item = JSON.parse(event.data) as {
          id: string,
          name: string,
          points: string[],
        }
        setItems(items => [...items, item])
      }
    };
  }, [setIsLoading])

  const searchHandler = useCallback(() => {
    search(expression)
  }, [search, expression]);

  const predifinedHandler = useCallback((pattern: string) => {
    search(pattern)
  }, [search])

  const predifinedCardsHandler = useCallback(() => {
    predifinedHandler("\\b(\\d{16})\\b|\\b(\\d{4} \\d{4} \\d{4} \\d{4})\\b")
  }, [predifinedHandler])


  const predifinedPassportHandler = useCallback(() => {
    predifinedHandler("\\b(\\d{4} \\d{6})\\b|\\b(\\d{4} № \\d{6})\\b|\\b(\\d{4}-\\d{6})\\b|\\b(\\d{4}-\\d{6})\\b|\\b(\\d{4}№\\d{6})\\b|\\b(\\d{4} N\\d{6})\\b|\\b(\\d{2} \\d{2} N \\d{6})\\b|\\b(\\d{2} \\d{2} № \\d{6})\\b|\\b(\\d{4} N \\d{6})\\b|\\b(\\d{2} \\d{2} № \\d{6})\\b|\\b(\\d{4} \\d{3} № \\d{6})\\b")
  }, [predifinedHandler])


  const predifinedPhoneHandler = useCallback(() => {
    predifinedHandler("\\b(?:\\d?7|\\b8)(?:\\d*[(\\-]?\\d{3}\\)?|\\d*\\d{3}[-)]?)\\d*\\d{3}[- ]?\\d{2}[- ]?\\d{2}\\b")
  }, [predifinedHandler])


  const predifinedSnilsHandler = useCallback(() => {
    predifinedHandler("\\b(\\d{3}-\\d{3}-\\d{3} \\d{2})\\b")
  }, [predifinedHandler])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        {
          isLoading && <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        }
      </AppBar>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={3} justifyContent="center">
          <Button fullWidth onClick={predifinedCardsHandler} variant="contained" size="small">Cards</Button>
        </Grid>
        <Grid item xs={3} justifyContent="center">
          <Button fullWidth onClick={predifinedPassportHandler} variant="contained" size="small">Passport</Button>
        </Grid>
        <Grid item xs={3} justifyContent="center">
          <Button fullWidth onClick={predifinedPhoneHandler} variant="contained" size="small">Phone</Button>
        </Grid>
        <Grid item xs={3} justifyContent="center">
          <Button fullWidth onClick={predifinedSnilsHandler} variant="contained" size="small">Snils</Button>
        </Grid>
        <Grid item xs={10}>
          <TextField size='small' fullWidth id="outlined-basic" label="Search expression" variant="outlined" value={expression} onChange={(event) => setExpression(event.target.value)} />
        </Grid>
        <Grid item xs={2} justifyContent="center">
          <Button fullWidth onClick={searchHandler} variant="contained" size="medium" disabled={expression === ""}>Search</Button>
        </Grid>
        <Grid item xs={12}>
          {
            items.length > 0 && <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>id</TableCell>
                    <TableCell>Filename</TableCell>
                    <TableCell>Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.points.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
