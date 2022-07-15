// tinymce.init({
//     selector: 'textarea#Essay',
//     height: 500,
//     menubar: false,
//     plugins: [
//       'advlist autolink lists link image charmap print preview anchor',
//       'searchreplace visualblocks code fullscreen',
//       'insertdatetime media table paste code help wordcount'
//     ],
//     toolbar: 'undo redo | formatselect | ' +
//     'bold italic backcolor | alignleft aligncenter ' +
//     'alignright alignjustify | bullist numlist outdent indent | ' +
//     'removeformat | help'
//   });

  tinymce.init({
    selector: 'textarea#Essay',
    height: 500,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' + 
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help |',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
  });
