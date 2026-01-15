/**
 * DOMHelper - Helpers para manipulação de DOM
 *
 * Utilitários para trabalhar com elementos do DOM de forma segura
 *
 * @example
 * const element = DOMHelper.getElement('meu-input');
 * DOMHelper.setValue('meu-input', 'novo valor');
 */
export class DOMHelper {
  // Cache de elementos para melhor performance
  static elementCache = new Map();

  /**
   * Obtém um elemento do DOM com cache
   * @param {string} id - ID do elemento
   * @param {boolean} useCache - Se deve usar cache (padrão: true)
   * @returns {HTMLElement|null}
   */
  static getElement(id, useCache = true) {
    if (useCache && this.elementCache.has(id)) {
      return this.elementCache.get(id);
    }

    const element = document.getElementById(id);

    if (element && useCache) {
      this.elementCache.set(id, element);
    }

    return element;
  }

  /**
   * Obtém o valor de um input
   * @param {string} id - ID do input
   * @returns {string}
   */
  static getValue(id) {
    const element = this.getElement(id);
    return element ? element.value : '';
  }

  /**
   * Define o valor de um input
   * @param {string} id - ID do input
   * @param {string} value - Valor a definir
   * @returns {boolean} Sucesso da operação
   */
  static setValue(id, value) {
    const element = this.getElement(id);

    if (!element) {
      console.warn(`Elemento com ID "${id}" não encontrado`);
      return false;
    }

    element.value = value;
    return true;
  }

  /**
   * Mostra um elemento
   * @param {string} id - ID do elemento
   */
  static show(id) {
    const element = this.getElement(id);
    if (element) {
      element.style.display = '';
      element.classList.remove('hidden');
    }
  }

  /**
   * Oculta um elemento
   * @param {string} id - ID do elemento
   */
  static hide(id) {
    const element = this.getElement(id);
    if (element) {
      element.classList.add('hidden');
    }
  }

  /**
   * Alterna visibilidade de um elemento
   * @param {string} id - ID do elemento
   */
  static toggle(id) {
    const element = this.getElement(id);
    if (element) {
      element.classList.toggle('hidden');
    }
  }

  /**
   * Adiciona uma classe a um elemento
   * @param {string} id - ID do elemento
   * @param {string} className - Nome da classe
   */
  static addClass(id, className) {
    const element = this.getElement(id);
    if (element) {
      element.classList.add(className);
    }
  }

  /**
   * Remove uma classe de um elemento
   * @param {string} id - ID do elemento
   * @param {string} className - Nome da classe
   */
  static removeClass(id, className) {
    const element = this.getElement(id);
    if (element) {
      element.classList.remove(className);
    }
  }

  /**
   * Define o texto de um elemento
   * @param {string} id - ID do elemento
   * @param {string} text - Texto a definir
   */
  static setText(id, text) {
    const element = this.getElement(id);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Define o HTML de um elemento
   * @param {string} id - ID do elemento
   * @param {string} html - HTML a definir
   */
  static setHTML(id, html) {
    const element = this.getElement(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  /**
   * Limpa o cache de elementos
   */
  static clearCache() {
    this.elementCache.clear();
  }

  /**
   * Remove um elemento específico do cache
   * @param {string} id - ID do elemento
   */
  static removeFromCache(id) {
    this.elementCache.delete(id);
  }

  /**
   * Adiciona event listener de forma segura
   * @param {string} id - ID do elemento
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   * @returns {boolean} Sucesso da operação
   */
  static addEventListener(id, event, callback) {
    const element = this.getElement(id);

    if (!element) {
      console.warn(`Elemento com ID "${id}" não encontrado para event listener`);
      return false;
    }

    element.addEventListener(event, callback);
    return true;
  }

  /**
   * Habilita um input
   * @param {string} id - ID do input
   */
  static enable(id) {
    const element = this.getElement(id);
    if (element) {
      element.disabled = false;
    }
  }

  /**
   * Desabilita um input
   * @param {string} id - ID do input
   */
  static disable(id) {
    const element = this.getElement(id);
    if (element) {
      element.disabled = true;
    }
  }

  /**
   * Verifica se um elemento existe
   * @param {string} id - ID do elemento
   * @returns {boolean}
   */
  static exists(id) {
    return this.getElement(id) !== null;
  }

  /**
   * Foca em um elemento
   * @param {string} id - ID do elemento
   */
  static focus(id) {
    const element = this.getElement(id);
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  /**
   * Cria um elemento HTML
   * @param {string} tag - Tag do elemento (div, span, etc)
   * @param {Object} attributes - Atributos do elemento
   * @param {string} content - Conteúdo do elemento
   * @returns {HTMLElement}
   */
  static createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
      if (key === 'class') {
        element.className = attributes[key];
      } else if (key === 'style') {
        Object.assign(element.style, attributes[key]);
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });

    if (content) {
      element.innerHTML = content;
    }

    return element;
  }

  /**
   * Remove todos os filhos de um elemento
   * @param {string} id - ID do elemento
   */
  static clearChildren(id) {
    const element = this.getElement(id);
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }
}
