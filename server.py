from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Timesheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slots = db.Column(db.Text())

    def __init__(self, slots):
        self.slots = slots


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/slots', methods=['GET', 'POST'])
def slots():
    if request.method == 'POST':
        _save_slots()
        return 'Ok'
    else:
        return _return_slots(), 200, {'Content-Type': 'application/json'}


def _save_slots():
    timesheets = Timesheet.query.all();
    if not timesheets:
        timesheet = Timesheet(slots=request.data)
        db.session.add(timesheet)
    else:
        timesheet = timesheets[0]
        timesheet.slots = request.data
    db.session.commit()


def _return_slots():
    timesheets = Timesheet.query.all();
    if timesheets:
        return timesheets[0].slots
    return '[]'


if __name__ == '__main__':
    app.run(debug=True)
