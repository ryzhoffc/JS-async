import { Product } from './classes/Product.js';
import { Category } from './classes/Category.js';

document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.querySelector('#accordion_filter-categories'),
    mainCategoriesCheckboxs = accordion.querySelector(
      '.main__categories-checkboxs'
    ),
    mainProductsList = document.querySelector('.main__products-list'),
    modal = document.querySelector('#popup-modal'),
    countResult = document.querySelector('.main__info-bord-results'),
    btnsDownloadMore = document.querySelectorAll('[data-download-more]'),
    message = {
      loading: 'Загрузка',
      success: 'Операция прошла успешна!',
      failure: 'Что-то пошло не так...',
    };
  let textModal = modal.querySelector('#h3Title');

  let delProd = null,
    arrayCategories = [],
    arrayCheck = [],
    currentLimit = 6;

  let promiseCategories = fetch(
      'https://fakestoreapi.com/products/categories'
    ).then((res) => res.json()),
    promiseProducts = fetch(
      `https://fakestoreapi.com/products?limit=${currentLimit}`
    ).then((res) => res.json());

  Promise.all([promiseCategories, promiseProducts])
    .then(([objCategories, objProducts]) => {
      fillDataCategory(objCategories);
      objProducts.forEach((product) => {
        fillDataProduct(product);
      });
      sumResults();
    })
    .catch((error) => {
      console.error(error);
    });

  function sumResults() {
    countResult.textContent = `${
      document.querySelectorAll('.main__product-card').length
    } results`;
  }

  function fillDataCategory(obj) {
    obj.forEach((item, index) => {
      new Category(index, item, '.main__categories-checkboxs').render();
      arrayCategories.push(item);
    });
  }
  function fillDataProduct(obj) {
    let { id, title, price, category, description, image } = obj,
      { rate, count } = obj.rating;
    new Product(
      id,
      title,
      price,
      category,
      description,
      image,
      rate,
      count,
      '.main__products-list'
    ).render();
  }

  mainProductsList.addEventListener('click', (e) => {
    if (
      e.target.getAttribute('data-open-modal') == '' ||
      e.target.classList.contains('main_product-card_btn-delete')
    ) {
      const delElement = document.getElementById(
          e.target.getAttribute('data-id')
        ),
        titleElement = delElement
          .querySelector('.main__product-card_title')
          .textContent.trim();
      // console.log(titleElement);
      openModal(titleElement, delElement);
    }
  });

  // Delete product

  async function deleteProduct(id) {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE',
      });
      return res;
    } catch (error) {
      console.error('Произошла ошибка!', error);
    }
  }

  // MODAL

  function openModal(title = null, elementDel = null) {
    if (title !== null && elementDel !== null) {
      let indSp = title.indexOf(' ');
      textModal.textContent = `Are you sure want to delete ${
        title.substring(0, indSp) + '...'
      } ?`;
      delProd = elementDel.id;
    }

    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (!modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  modal.addEventListener('click', async (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '')
      closeModal();

    if (e.target.getAttribute('data-del-product') == '' && delProd !== null) {
      try {
        let res = await deleteProduct(delProd);
        if (res.ok) {
          showThanksModal();
          const delElement = document.getElementById(delProd);
          delElement.remove();
          delProd = null;
        } else {
          throw new Error(message.failure + 'Ошибка: ' + res.status);
        }
      } catch (error) {
        showThanksModal(error);
      }
    }
  });

  function toggleHideModalTextAndButtons(modal) {
    let btnsModal = modal.querySelectorAll('button'),
      text = modal.querySelector('#h3Title');
    text.classList.toggle('hidden');
    btnsModal.forEach((btn) => {
      btn.classList.toggle('hidden');
    });
  }

  function showThanksModal(errorMessage = null) {
    toggleHideModalTextAndButtons(modal);
    const messageTopic = document.createElement('h3');
    messageTopic.classList.add('message-topic');
    if (errorMessage === null) {
      messageTopic.textContent = message.success;
    } else {
      messageTopic.textContent = errorMessage;
    }

    document.querySelector('.h3-wrapper').append(messageTopic);
    openModal();

    setTimeout(() => {
      messageTopic.remove();
      toggleHideModalTextAndButtons(modal);
      textModal.classList.remove('hidden');
      closeModal();
    }, 2000);
  }

  // Form
  const form = document.querySelector('form');

  bindPostData(form);

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: data,
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(message.failure + 'Ошибка: ' + res.status);
    }
  };

  function bindPostData(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form),
        object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      postData('https://fakestoreapi.com/products', JSON.stringify(object))
        .then((data) => {
          console.log(data);
          showThanksModal();
        })
        .catch((error) => {
          showThanksModal(error);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  // Pagination

  btnsDownloadMore.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      pagination();
    });
  });

  const pagination = async (limit = 0) => {
    if (limit === 0) currentLimit += 6;
    else currentLimit = limit;
    if (currentLimit >= 30) currentLimit = 30;
    try {
      const res = await fetch(
        `https://fakestoreapi.com/products?limit=${currentLimit}`
      );
      console.log(res);
      if (res.status === 200) {
        mainProductsList.innerHTML = '';
        const products = await res.json();
        products.forEach((product) => {
          fillDataProduct(product);
        });
        sumResults();
      } else {
        throw new Error(res.status + 'Произошла ошибка при загрузке данных');
      }
    } catch (error) {
      showThanksModal('Произошла ошибка:' + error);
    }
  };

  // Filter by Categories

  // Вариант 1
  accordion.addEventListener('click', async (event) => {
    let parent = event.target.parentElement;
    if (
      parent.getAttribute('data-cat') == '' &&
      event.target.tagName === 'INPUT'
    ) {
      if (!event.target.checked) {
        event.target.checked = false;
        currentLimit = 6;
        pagination(currentLimit);
      } else {
        const checkboxs = mainCategoriesCheckboxs.querySelectorAll('input');
        checkboxs.forEach((checkbox) => {
          checkbox === event.target
            ? (checkbox.checked = true)
            : (checkbox.checked = false);
        });
        let id = +parent.id.replace(/\D/g, '');
        await filteringByCaterories(arrayCategories[id]);
      }
    }
  });

  async function filteringByCaterories(category) {
    try {
      const res = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      if (res.status === 200) {
        const categoryProducts = await res.json();
        mainProductsList.innerHTML = '';
        categoryProducts.forEach((product) => {
          fillDataProduct(product);
        });
        sumResults();
      } else {
        throw new Error(message.failure + 'Ошибка: ' + res.status);
      }
    } catch (error) {
      showThanksModal(error);
    }
  }
  // Вариант 2
  // accordion.addEventListener('click', (event) => {
  //   let parent = event.target.parentElement;
  //   if (
  //     parent.getAttribute('data-cat') == '' &&
  //     event.target.tagName === 'INPUT'
  //   ) {
  //     let id = +parent.id.replace(/\D/g, '');
  //     if (event.target.checked) {
  //       arrayCheck.push(id);
  //     } else {
  //       arrayCheck.splice(arrayCheck.indexOf(id), 1);
  //     }
  //     let arrCat = arrayCategories.filter((item, index) =>
  //       arrayCheck.includes(index)
  //     );
  //     console.log(arrCat);
  //     filteringByCaterories(arrCat);
  //   }
  // });
  // function filteringByCaterories(array) {
  //   if (array.length === 0) {
  //     currentLimit = 6;
  //     pagination(currentLimit);
  //   } else {
  //     const promiseArray = array.map((category) => {
  //       return fetch(
  //         `https://fakestoreapi.com/products/category/${category}`
  //       ).then((res) => res.json());
  //     });
  //     mainProductsList.innerHTML = '';
  //     Promise.all(promiseArray)
  //       .then((objectsArray) => {
  //         objectsArray.forEach((products) => {
  //           products.forEach((product) => {
  //             fillDataProduct(product);
  //           });
  //         });
  //         sumResults();
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }
});