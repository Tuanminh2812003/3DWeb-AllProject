import { useEffect } from 'react';
import throttle from 'lodash.throttle';

const ResizeHandler = ({ updateItemsForScreenSize }) => {
    useEffect(() => {
        const handleResize = throttle(() => {
            const width = window.innerWidth;
            let newItems = [];

            if (width < 600) {
                newItems = [
                    
                ];
            } else if (width < 1200) {
                newItems = [
                    
                ];
            } else {
                newItems = [
                    {
                        id: 1,
                        position: [-30, 6, 30.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/v1733041086/nizgtkvtasbhvbieofwy.png",
                        info: { artist: 'Rap Xiec', title: 'Những thành phố Mơ màng', year: 2025 },
                    },
                    {
                        id: 2,
                        position: [30, 6, 30.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/03._03-02_fumljy?_a=BAMABmRg0",
                        info: { artist: 'VietDoodle Gallery', title: 'Ngày thành lập Đảng Cộng sản Việt Nam', year: 2024 },
                    },
                    {
                        id: 3,
                        position: [-30, 6, 0.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/04._23-2_nu4mya?_a=BAMABmRg0",
                        info: { artist: 'VietDoodle Gallery', title: 'Giỗ tổ ca trù', year: 2025 },
                    },
                    {
                        id: 4,
                        position: [30, 6, 0.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/06._28-02_p15rby?_a=BAMABmRg0",
                        info: { artist: 'Google', title: 'Ngày sinh nhạc sĩ Trịnh Công Sơn', year: 2025 },
                    },
                    {
                        id: 5,
                        position: [-30, 6, -29.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/07._08-3_qgeed9?_a=BAMABmRg0",
                        info: { artist: 'Hieu', title: 'Ngày quốc tế phụ nữ', year: 2025 },
                    },
                    {
                        id: 6,
                        position: [30, 6, -29.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/08._24-03_nlmnny?_a=BAMABmRg0",
                        info: { artist: 'Google', title: 'Ngày bánh mì Việt Nam', year: 2025 },
                    },
                    {
                        id: 7,
                        position: [30, 6, -30.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/10._30-4_gsijet?_a=BAMABmRg0",
                        info: { artist: 'Minh', title: '30/4', year: 2025 },
                    },
                    {
                        id: 8,
                        position: [-30, 6, -30.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/11._01-5_oikno2?_a=BAMABmRg0",
                        info: { artist: 'Google', title: 'Quốc tế lao động', year: 2025 },
                    },
                    {
                        id: 9,
                        position: [30, 6, -0.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/12._12-5_mf7dsn?_a=BAMABmRg0",
                        info: { artist: 'Google', title: 'Ngày của mẹ', year: 2025 },
                    },
                    {
                        id: 10,
                        position: [-30, 6, -0.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/13._19-05_q5vub3?_a=BAMABmRg0",
                        info: { artist: 'Minh', title: 'Ngày sinh chủ tịch Hồ Chí Minh', year: 2025 },
                    },
                    {
                        id: 11,
                        position: [-30, 6, 29.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/19._01-9_ghk3rg?_a=BAMABmRg0",
                        info: { artist: 'Google', title: '0Nho', year: 2025 },
                    },
                    {
                        id: 13,
                        position: [30, 6, 29.5],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/20._02-9_rj8rrj?_a=BAMABmRg0",
                        info: { artist: 'Google', title: '2/9', year: 2025 },
                    },
                    {
                        id: 14,
                        position: [-40, 8, 85],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/21._10-9_htxki4?_a=BAMABmRg0",
                        info: { artist: 'VietDoodle Gallery', title: 'Ngày thành lập mặt trận tổ quốc Việt Nam', year: 2025 },
                    },
                    {
                        id: 15,
                        position: [40, 8, 85],
                        rotation: [0, 180, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/22._06-10_houdzu?_a=BAMABmRg0",
                        info: { artist: 'Google', title: 'Xuân Diệu', year: 2025 },
                    },
                    {
                        id: 16,
                        position: [40, 8, -56.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/24._20-10_vvzcfo?_a=BAMABmRg0",
                        info: { artist: 'Google', title: '0Ro', year: 2025 },
                    },
                    {
                        id: 17,
                        position: [-40, 8, -56.5],
                        rotation: [0, 0, 0],
                        scale: 8,
                        imageUrl: "https://res.cloudinary.com/dqlelya6o/image/upload/v1713236257/xkd1rxsz521g48hhzav1.gif",
                        info: { artist: 'Google', title: '0Ro', year: 2025 },
                    },
                    {
                        id: 18,
                        position: [0, 9, -56.5],
                        rotation: [0, 0, 0],
                        scale: 12,
                        imageUrl: "/Vietdoodle Flyer-03.png",
                        info: { artist: 'Google', title: '0Ro', year: 2025 },
                    },
                    {
                        id: 19,
                        position: [0, 9, 101],
                        rotation: [0, 180, 0],
                        scale: 12,
                        imageUrl: "/Vietdoodle Flyer-03.png",
                        info: { artist: 'Google', title: '0Ro', year: 2025 },
                    },
                    
                ];
            }

            // Check if newItems is different from current items
            updateItemsForScreenSize((prevItems) => {
                if (JSON.stringify(prevItems) !== JSON.stringify(newItems)) {
                    return newItems;
                }
                return prevItems;
            });
        }, 200); // Throttle resize events to every 200ms

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to handleResize to set initial items

        return () => window.removeEventListener('resize', handleResize);
    }, [updateItemsForScreenSize]);

    return null;
};

export default ResizeHandler;
