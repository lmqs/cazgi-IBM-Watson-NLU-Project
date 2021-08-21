import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.emotions.map((item, k) => (
                        (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colspan="2">
                                            {JSON.stringify(item.text)}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.emotions.map((item2) => (
                                        <>
                                            <tr>
                                                <td>
                                                    {item2[0]}
                                                </td>
                                                <td>
                                                    {item2[1]}
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        )
                    ))
                }


            </div>
        );
    }

}
export default EmotionTable;