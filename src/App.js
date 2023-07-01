import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";

const LogViewer = ({ logFile }) => {
  const [logData, setLogData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "created", direction: "ascending" });
  const [sortedLogData, setSortedLogData] = useState([]);

  const FormattedLog = ({ log }) => {
    if (!log) return null;

    const formattedLog = log.replace(/\n/g, "<br/>");
    return <div dangerouslySetInnerHTML={{ __html: formattedLog }} />;
  };

  useEffect(() => {
    fetch(logFile)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // log the fetched data
        setLogData(data);
        setSortedLogData(data);
      });
  }, [logFile]);

  useEffect(() => {
    const sortArray = [...logData];
    if (sortConfig.direction === "ascending") {
      sortArray.sort((a, b) => (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1));
    } else {
      sortArray.sort((a, b) => (a[sortConfig.key] < b[sortConfig.key] ? 1 : -1));
    }
    setSortedLogData(sortArray);
  }, [sortConfig, logData]); // Here we added `logData` as a dependency

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleClose = () => setShowModal(false);
  const handleShow = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };
  return (
    <div className="border border-dark border-3 table-box bg-dark">
      <table className="table table-dark table-striped table-hover text-center">
        <thead>
          <tr>
            <th onClick={() => requestSort("type")} className="bg-secondary" scope="col">
              Status {sortConfig.key === "type" && (sortConfig.direction === "ascending" ? " 🔼" : " 🔽")}
            </th>
            <th onClick={() => requestSort("created")} className="bg-secondary" scope="col">
              Date and Time {sortConfig.key === "created" && (sortConfig.direction === "ascending" ? " 🔼" : " 🔽")}
            </th>
            <th onClick={() => requestSort("subject")} className="bg-secondary" scope="col">
              Subject {sortConfig.key === "subject" && (sortConfig.direction === "ascending" ? " 🔼" : " 🔽")}
            </th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {sortedLogData.map((log, index) => {
            const date = new Date(log.created);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

            return (
              <tr
                key={index}
                onClick={function () {
                  if (log.body != null) {
                    return handleShow(log);
                  }
                }}>
                <td>
                  {log.type === "1" && <img src={process.env.PUBLIC_URL + "/success.png"} alt="Success" />}
                  {log.type === "2" && <img src={process.env.PUBLIC_URL + "/warning.png"} alt="Warning" />}
                  {log.type === "3" && <img src={process.env.PUBLIC_URL + "/error.png"} alt="Error" />}
                </td>
                <td>{formattedDate}</td>
                <td>{log.subject}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="display-6">Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedLog log={selectedLog?.body} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LogViewer;
