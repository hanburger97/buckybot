module.exports = {
    
    createText: (text) => {
        return {
            text
        }
    },

    createQuickReplies: (text, qr) => {
        let quick_replies = qr.map(x => {
            return {
                "content_type":"text",
                "title":x.title,
                "payload":x.payload,
                "image_url": x.url || null
            }
        })
        return {
            text,
            quick_replies
        }
    }
}