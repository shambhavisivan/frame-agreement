import React, { Component } from 'react';
import './menu.css';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };

    this._isMounted = false;

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    this.menuEdit = this.menuEdit.bind(this);
    this.menuRemove = this.menuRemove.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {
    let bool = false;
    try {
      bool = this.dropdownMenu.contains(event.target);
    } catch (err) {}

    if (!bool && this._isMounted) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  menuEdit(e) {
    if (this._isMounted) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
    this.props.onEdit(e);
  }

  menuRemove(e) {
    if (this._isMounted) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
    this.props.onRemove();
  }

  render() {
    return (
      <div className="rcm-menu" onClick={this.showMenu}>
        <span className="rcm-menu-toggle" />
        {this.state.showMenu && (
          <ul
            className="rcm-menu-list"
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
            <li onClick={this.menuEdit}>Edit</li>
            <li onClick={this.menuRemove}>Remove</li>
          </ul>
        )}
      </div>
    );
  }
}
export default Menu;
