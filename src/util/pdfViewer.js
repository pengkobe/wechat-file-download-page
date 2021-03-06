import $ from 'webpack-zepto';

function ViewPDF(url) {
  // If absolute URL from the remote server is provided, configure the CORS
  // The workerSrc property shall be specified.
  PDFJS.workerSrc = './assets/vendor/pdf.worker.min.js';

  let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
      const accWidth = document.documentElement.clientWidth;
      const accHeight = document.documentElement.clientHeight;
      let viewport = page.getViewport(1);

      scale = accWidth / viewport.width;
      viewport = page.getViewport(scale);
      canvas.height = accHeight; //viewport.height;
      canvas.width = accWidth; //viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function() {
        $('#loadingTips').hide();
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    // Update page counters
    document.getElementById('page_num').textContent = pageNum;
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  const myElement = document.getElementById('container');
  // Create a manager to manager the element
  const manager = new Hammer.Manager(myElement);
  // Create a recognizer
  const Swipe = new Hammer.Swipe();
  // Add the recognizer to the manager
  manager.add(Swipe);
  // Declare global variables to swiped correct distance
  let deltaX = 0;
  // Subscribe to a desired event
  manager.on('swipe', function(e) {
    deltaX = deltaX + e.deltaX;
    const direction = e.offsetDirection;
    const translate3d = 'translate3d(' + deltaX + 'px, 0, 0)';
    // 右
    if (direction === 2) {
      console.log('右', deltaX);
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    // 左
    if (direction === 4) {
      console.log('左：', deltaX);
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
  });

  /**
   * Asynchronously downloads PDF.
   */
  PDFJS.getDocument(url).then(
    function(pdfDoc_) {
      pdfDoc = pdfDoc_;
      document.getElementById('page_count').textContent = pdfDoc.numPages;

      // Initial/first page rendering
      renderPage(pageNum);
    },
    function(err) {
      $('#dowLoadFile').hide();
      alert('链接不合法！');
    }
  );
}

export { ViewPDF };
