const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Define các route cho message ở đây

// Ví dụ: Route GET cho danh sách message
router.get('/getAll', async (req, res) => {
    try {
        const data = await Message.find();
        res.json({
            statusCode : 200,
            message : "success",
            data : data
        })
    }
    catch (error) {
        res.json({
            statusCode : 500,
            message : error.message,
            data : null
        }) 
    }
});

// Route get message chưa post cho channelId 
router.get('/getReadyToPost', async (req, res) => {
    try {
        const {channelId, limit} = req.query;
        // Convert limit to integer
        const limitInt = parseInt(limit, 10) || 10; // Default limit to 10 if not provided

        // Find messages based on criteria
        const messages = await Message.find({
            channelId: channelId,
            postState: false,
            trustState: true
        }).sort({ createdAt: -1 }).limit(limitInt);

        res.json({
            statusCode : 200,
            message : "success",
            data : messages
        })
    }
    catch (error) {
        res.json({
            statusCode : 500,
            message : error.message,
            data : null
        }) 
    }
});

// Route POST /update/:id
router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params; // Đây là giá trị của messageId
        const updatedData = req.body;

        // Tìm và cập nhật dựa trên trường messageId
        const updatedMessage = await Message.findOneAndUpdate(
            { messageId: id }, // Tiêu chí tìm kiếm dựa trên messageId
            { $set: updatedData },
            { new: true, runValidators: true } // Trả về tài liệu đã cập nhật và kiểm tra ràng buộc
        );

        if (!updatedMessage) {
            return res.json({
                statusCode: 404,
                message: "Error: Message not found",
                data: updatedData
            });
        }

        res.json({
            statusCode: 200,
            message: "Success",
            data: updatedMessage
        });
    } catch (error) {
        res.json({
            statusCode: 500,
            message: error.message,
            data: null
        });
    }
});

// Route POST cho tạo mới hoặc cập nhật message
router.post('/', async (req, res) => {
    const { messageId, ...data } = req.body; // Tách messageId ra khỏi dữ liệu khác

    try {
        // Kiểm tra nếu messageId đã tồn tại
        const existingMessage = await Message.findOne({ messageId });

        if (existingMessage) {
            // Cập nhật tài liệu nếu messageId đã tồn tại
            const updatedMessage = await Message.findOneAndUpdate(
                { messageId },
                { $set: data },
                { new: true, runValidators: true }
            );

            res.json({
                statusCode: 200,
                message: "Message updated successfully",
                data: updatedMessage
            });
        } else {
            // Tạo mới tài liệu nếu messageId không tồn tại
            const newMessage = new Message({
                messageId,
                ...data
            });

            const savedMessage = await newMessage.save();

            res.json({
                statusCode: 200,
                message: "Message created successfully",
                data: savedMessage
            });
        }
    } catch (error) {
        res.json({
            statusCode: 400,
            message: error.message,
            data: null
        });
    }
});

// Xuất router để sử dụng ở file khác
module.exports = router;
