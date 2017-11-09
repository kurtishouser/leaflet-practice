import './info-panel.scss'
import template from './info-panel.html'

import { Component } from '../component'

/**
 * Info Panel Component
 * Download and display metadata for selected items.
 * @extends Component
 */
export class InfoPanel extends Component {
  /** LayerPanel Component Constructor
   * @param { Object } props.data.apiService ApiService instance to use for data fetching
   */
  constructor (placeholderId, props) {
    super(placeholderId, props, template)

    // Toggle info panel on title click
    this.refs.title.addEventListener('click', () => this.refs.container.classList.toggle('info-active'))
  }

  showInfo (eventDetail) {
    const { _id, title, description, author, asset } = eventDetail;
    // Display location title
    this.refs.title.innerHTML = `<h1>${title}</h1>`;

    this.refs.content.innerHTML = `<h3>${asset.toUpperCase()}</h3><p>Description:<br>${description}</p><p>Author:<br>${author}</p>`
  }

}
