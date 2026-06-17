console.log("handleAttachment called");
return {
  messages: [
    {
      text: "Please use the upload button below to attach your file. Supported formats: JPG, PNG, PDF, DOCX. Maximum size: 5 MB."
    },
    {
      card: {
        inputs: [
          {
            type: "file",
            title: "Upload Attachment",
            uuid: "2e6e7e36-657c-4390-ba06-fa80597871ae"
          }
        ]
      }
    }
  ]
};