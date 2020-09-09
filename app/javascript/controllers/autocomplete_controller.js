import { Controller } from 'stimulus'
import places from 'places.js';

export default class extends Controller {
  connect() {
    this.initAutocomplete()
  }

  initAutocomplete = () => {
    const addressInput = document.getElementById('flat_address');
    if (addressInput) {
      places({ container: addressInput });
    }
  };
}