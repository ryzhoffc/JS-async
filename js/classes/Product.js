// import del from '../../css/img/del.png';
export class Product {
  constructor(
    id,
    title,
    price,
    category,
    description,
    image,
    rate = 0,
    count = 0,
    parentSelector
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.category = category;
    this.description = description;
    this.src = image;
    this.classList = ['main__product-card'];
    this.rate = +rate;
    this.count = +count;
    this.parent = document.querySelector(parentSelector);
  }

  render() {
    const element = document.createElement('div');
    element.classList.add(...this.classList);
    element.setAttribute('id', this.id);
    element.innerHTML = `
    <div class="flex flex-col rounded-lg  shadow-secondary-1">
        <div class="main__product-card_img">
            <a href="#!">
                <img src="${this.src}" class="rounded-t-lg w-full "  alt=""/>
            </a>
        </div>
        <div class="main__product-card_info">
            <h5 class="main__product-card_title ">
                ${this.title}
            </h5>
            <p class="main__product-card_description">
                ${this.description}
            </p>
            <div class="main_product-card_price-rate-count">
                <p class="main_product-card_price">$ ${this.price}</p>
                <p class="main_product-card_rate mb-4 text-base">rate: <span>${this.rate}</span> </p>
                <p class="main_product-card_count mb-4 text-base">count: <span>${this.count}</span></p>
            </div>  
            <button
                type="button"
                class="main_product-card_btn-delete"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                data-id =${this.id}
            >
              <svg data-id =${this.id} data-open-modal fill="#FFFFFF" width="24px" height="24px" viewBox="0 0 0.72 0.72" xmlns="http://www.w3.org/2000/svg"><path d="M0.6 0.18h-0.12V0.15a0.09 0.09 0 0 0 -0.09 -0.09h-0.06a0.09 0.09 0 0 0 -0.09 0.09v0.03H0.12a0.03 0.03 0 0 0 0 0.06h0.03v0.33a0.09 0.09 0 0 0 0.09 0.09h0.24a0.09 0.09 0 0 0 0.09 -0.09V0.24h0.03a0.03 0.03 0 0 0 0 -0.06M0.3 0.15a0.03 0.03 0 0 1 0.03 -0.03h0.06a0.03 0.03 0 0 1 0.03 0.03v0.03h-0.12Zm0.21 0.42a0.03 0.03 0 0 1 -0.03 0.03H0.24a0.03 0.03 0 0 1 -0.03 -0.03V0.24h0.3Z"/></svg>
                
            </button>
        </div>
      </div>
    `;
    const img = element.querySelector('img');
    img.style.maxHeight = '210px';
    img.style.height = '210px';
    img.style.objectFit = 'contain';
    const elemRate = element.querySelector('.main_product-card_rate span'),
      elemCount = element.querySelector('.main_product-card_count span');
    this.rate > 4
      ? elemRate.classList.add('green-text')
      : this.rate > 2.5 && this.rate <= 4
      ? elemRate.classList.add('yellow-text')
      : elemRate.classList.add('rose-text');
    this.count > 100
      ? elemCount.classList.add('green-text')
      : this.count > 10 && this.count <= 100
      ? elemCount.classList.add('yellow-text')
      : elemCount.classList.add('rose-text');

    this.parent.append(element);
  }
}