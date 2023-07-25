import { useState } from "react";
import { Button, Col, Modal } from "antd";

function AdvancedTimeslotSelection({isEdit}) {

    const [open, setOpen] = useState(false);

    return (
        <>

            <Col
                span={6}
                offset={(isEdit ? 4 : 11)}
                style={{ display: 'inline-block' }}>
                <Button
                    type="primary"
                    className="viewButton"
                    style={{ width: '100%' }}
                    onClick={() => setOpen(true)}

                >
                    Advanced Selection
                </Button>
            </Col>
            <Modal title="Advanced Selection" open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

export default AdvancedTimeslotSelection;