const API = 'api/v1/faqs';

    const form = document.getElementById('faq-form');
    const faqIdField = document.getElementById('faq-id');
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const videoInput = document.getElementById('video_url');
    const faqsDiv = document.getElementById('faqs');

    // Load all FAQs
    async function loadFAQs() {
        const res = await fetch(API);
        const faqs = await res.json();
      
        faqsDiv.innerHTML = '';
      
        faqs.forEach(faq => {
          const div = document.createElement('div');
          div.className = 'faq';
      
          div.innerHTML = `
            <div><strong>Q:</strong> ${faq.question}</div>
            <div><strong>A:</strong> ${faq.answer}</div>
            ${faq.video_url ? `<div><a href="${faq.video_url}" target="_blank">Watch Video</a></div>` : ''}
          `;
      
          // Create buttons
          const editBtn = document.createElement('button');
          editBtn.textContent = 'Edit';
          editBtn.addEventListener('click', () => editFAQ(faq._id));
      
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => deleteFAQ(faq._id));
      
          // Append buttons
          div.appendChild(editBtn);
          div.appendChild(deleteBtn);
      
          // Append the whole FAQ block
          faqsDiv.appendChild(div);
        });
      }
      

    // Create or Update FAQ
    form.onsubmit = async (e) => {
      e.preventDefault();

      const faq = {
        question: questionInput.value,
        answer: answerInput.value,
        video_url: videoInput.value
      };

      console.log(faq)
      const id = faqIdField.value;

      if (id) {
        // update
        await fetch(`${API}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq)
        });
      } else {
        // create
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faq)
        });
      }

      form.reset();
      faqIdField.value = '';
      loadFAQs();
    };

    // Load FAQ into form for editing
    async function editFAQ(id) {
      const res = await fetch(`${API}/${id}`);
      const faq = await res.json();

      faqIdField.value = faq._id;
      questionInput.value = faq.question;
      answerInput.value = faq.answer;
      videoInput.value = faq.video_url || '';
    }

    // Delete FAQ
    async function deleteFAQ(id) {
      if (confirm('Are you sure you want to delete this FAQ?')) {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        loadFAQs();
      }
    }

    // Initial load
    loadFAQs();