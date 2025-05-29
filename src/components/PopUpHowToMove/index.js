import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button } from '@mui/material';
import "./PopUpHowToMove.css";
import ButtonVR from "../ButtonVR";

const PopUpHowToMove = ({ open, handleClose, link }) => {
    return (
        <Modal open={open} onClose={() => handleClose('free')} BackdropProps={{ invisible: true }} >
            <Box 
                sx={{
                    position: 'absolute',
                    top: '40%', // Start higher than center
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '95%', // 90% width on extra small screens
                        sm: '90%', // 80% width on small screens
                        md: '50%',  //
                    },
                    maxHeight: '90%',
                    overflow: 'auto',
                    textAlign: 'center',
                    animation: 'slideDown 0.5s forwards, fadeIn 0.5s forwards',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div className='popUpMove__content' 
                    style={{ 
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        height: '100%',
                        padding: '20px',
                    }}
                >
                    <div style={{ 
                        position: 'absolute',
                        backgroundColor: '#2E2E2E',
                        top: '0',
                        left: '0',
                        width: '100%',
                        opacity: '0.8',
                        display: 'flex',
                        height: '100%',
                    }}>

                    </div>
                    <div className='popUpMove__content1' style={{ marginBottom: '40px', position: 'relative' }}>
                        <img src='/NTST/HDSD1.png' className='popUpMove__content__content__inner__img'/>
                    </div>
                    <div className='popUpMove__content2' style={{ marginBottom: '40px', position: 'relative' }}>
                        <img src='/NTST/HDSD2.png' className='popUpMove__content__content__inner__img'/>
                    </div>
                    <div className='popUpMove__content3' style={{ marginBottom: '40px', position: 'relative' }}>
                        <img src='/NTST/HDSD3.png' className='popUpMove__content__content__inner__img'/>
                    </div>
                    <div className='popUpMove__content4' style={{ marginBottom: '40px', position: 'relative' }}>
                        {/* <Button
                            onClick={() => handleClose('tour')} 
                            className='button1'
                        >
                            BẮT ĐẦU TOUR
                        </Button> */}
                        <Button 
                            onClick={() => handleClose('free')} 
                            className='button2'
                        >
                            BẮT ĐẦU TRẢI NGHIỆM
                        </Button>
                        <ButtonVR link={link}/>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default PopUpHowToMove;
