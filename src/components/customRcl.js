import React, { Component } from 'react';
import Menu from './menu';
import './customRcl.css';

class CustomRcl extends Component {
	constructor(props) {
		super(props);

		let editing = !!this.props.editing;
		this.state = {
			editing: editing,
			Name: '',
			Unit: '',
			originalValue: '',
			negotiatedValue: ''
		};

		// this.nameInput = React.createRef();
		// this.unitInput = React.createRef();
		// this.originalValueInput = React.createRef();
		// this.negotiatedValueInput = React.createRef();

		this.onRclRemove = this.onRclRemove.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		// this.removeItem = this.removeItem.bind(this);

		// this.props.rcl;
		// this.props.onChange;

		this.fields = ['Name', 'Unit', 'originalValue', 'negotiatedValue'];
	}

	componentDidMount() {
		this.fields.splice(2, 0, ...Object.keys(this.props.customFields));

		var _state = {};
		this.fields.forEach(f => {
			_state[f] = this.props.rcl[f] || '';
		});

		this.setState({ ..._state });
	}

	toggleEditing(e) {
		e.stopPropagation();

		if (this.state.editing) {
			let data = { ...this.props.rcl, ...this.state };
			delete data.editing;
			this.props.onChange(data);
		}

		this.setState({
			editing: !this.state.editing
		});
	}

	changeHandler(value, property) {
		let error = false;
		if (property === 'originalValue' || property === 'negotiatedValue') {
			try {
				value = +value;
			} catch (err) {
				error = true;
				console.error('Values is not an integer!');
			}
		}

		if (!error) {
			this.setState({
				[property]: value
			});
		}
	}

	onRclRemove() {
		this.props.onRemove(this.props.rcl.rateCardId, this.props.rcl.Id);
	}

	handleConfirm() {
		let data = { ...this.props.rcl, ...this.state };
		delete data.editing;
		this.props.onChange(data);

		this.setState({ editing: false });
	}

	render() {
		return (
			<tr className="vw-custom-rcl">
				{this.fields.map(field => {
					// if (this.state.editing || field === "negotiatedValue") {
					if (this.state.editing) {
						return (
							<td key={field}>
								<input
									className="rcm-input_sm"
									placeholder={field}
									value={this.state[field]}
									type="text"
									onChange={() => this.changeHandler(event.target.value, field)}
								/>
							</td>
						);
					} else {
						return (
							<td className={this.state[field] ? '' : 'red'} key={field}>
								{this.state[field] || '--' + field}
							</td>
						);
					}
				})}
				<td className="menu-cell">
					{this.state.editing ? (
						<span className="checkmark-confirm" onClick={this.handleConfirm} />
					) : (
						<Menu onEdit={this.toggleEditing} onRemove={this.onRclRemove} />
					)}
				</td>
			</tr>
		);
	}
}

export default CustomRcl;
