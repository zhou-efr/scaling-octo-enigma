import {Component} from "react";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages : [],
            current : "",
            ws : new WebSocket("ws://localhost:3002/ar")
        };
    }

    componentDidMount() {
        this.state.ws.onopen = () => {
            console.log("opened");
            this.state.ws.send(JSON.stringify({From: "zhou", Data: "message"}));
        };

        this.state.ws.onmessage = (event) => {
            const json = JSON.parse(event.data);
            try {
                if (json) {
                    let msgs = this.state.messages;
                    console.log(json);
                    msgs.push(json);
                    console.log(msgs);
                    this.setState({
                        messages: msgs
                    });
                }
            } catch (err) {
                console.log(err);
            }
        };
    }

    onMessageSend = () => {
        console.log("send");
        if(this.state.current){
            this.state.ws.send(JSON.stringify({From: "zhou", Data: this.state.current}));
            this.setState({
                current: ""
            })
        }
    }

    render() {
        const messages = this.state.messages;
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className={"w-1/4 h-1/2 rounded-xl flex flex-col border-neutral-700 border justify-between"}>
                    <div className={"h-full m-6 overflow-y-scroll"}>
                        {
                            messages.map((item, index) => {
                                return (
                                    <p key={index}><span className={"font-bold"}>{item.From} : </span>{item.Data}</p>
                                );
                            })
                        }
                    </div>
                    <div className={"flex flex-row"}>
                        <input
                            type={"text"}
                            className={"w-full m-2 p-2"}
                            placeholder={"Write here"}
                            value={this.state.current}
                            onChange={(e) => {
                                this.setState({current: e.target.value})
                            }}
                            onKeyDown={event => {
                                if(event.key === 'Enter') {
                                    this.onMessageSend();
                                }
                            }}
                        />
                        <input type={"submit"} className={"m-2 p-2 drop-shadow-md filter"} onClick={this.onMessageSend} value={"Send"}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
