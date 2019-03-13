import React, { Component } from 'react';

import Icon from '../Icon';
import Checkbox from './Checkbox';

import './DropdownCheckbox.css';

class DropdownCheckbox extends React.Component {
	constructor(props) {
		super(props);
		this.menu = React.createRef();

		this.showMenu = this.showMenu.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);

		this.state = {
			menu: false
		};

		// this.props.options
	}

	showMenu() {
		this.setState(
			{
				menu: true
			},
			() => {
				this.menu.current.focus();
			}
		);
	}

	onBlur() {
		this.setState({
			menu: false
		});
	}
	toggleVisibility(index) {
		this.props.onChange(index);
	}

	onChange(e) {}

	render() {
		return (
			<div className="dropdown-checkbox-container">
				{this.state.menu && (
					<ul
						ref={this.menu}
						tabIndex="0"
						className="menu"
						onBlur={this.onBlur}
					>
						{this.props.options.map((option, i) => {
							return (
								<li
									key={option.name}
									onClick={() => {
										this.toggleVisibility(i);
									}}
								>
									<Checkbox readOnly={option.visible} />
									{option.name}
								</li>
							);
						})}
					</ul>
				)}

				<div className="dropdown-placeholder" onClick={this.showMenu}>
					<span className="fa-margin-right-xsm">Display columns{' '}</span>
					<Icon
						name={this.state.menu ? 'chevronup' : 'chevrondown'}
						height="14"
						width="14"
						color="#0070d2"
					/>
				</div>
			</div>
		);
	}
}

export default DropdownCheckbox;
