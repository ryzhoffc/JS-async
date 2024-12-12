export class Category {
  constructor(id, nameCategory, parentSelector) {
    this.id = id;
    this.nameCategory = nameCategory;
    this.parent = document.querySelector(parentSelector);
  }

  render() {
    const element = document.createElement('div');
    element.setAttribute('id', `cat_${this.id}`);
    element.setAttribute('data-cat', '');
    element.classList.add('main__category-checkbox');
    element.innerHTML = `
        <input type="checkbox" value=${this.nameCategory} id=${
      this.nameCategory
    } />
            <label class="inline-block ps-[0.15rem] hover:cursor-pointer" for=${
              this.nameCategory
            }>${
      this.nameCategory[0].toUpperCase() + this.nameCategory.substring(1)
    }</label>
        `;
    this.parent.append(element);
  }
}